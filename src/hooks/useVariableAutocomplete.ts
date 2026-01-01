import { useState, useEffect, useRef, useCallback } from "react";
import { defaultVariables } from "@/types/embeds";

type AutocompletePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const useVariableAutocomplete = (
  onSelect: (variable: string) => void
) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState<AutocompletePosition | null>(null);
  const [query, setQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const variables = Object.keys(defaultVariables);

  const getCaretPosition = useCallback(() => {
    if (!textareaRef.current) return null;

    const element = textareaRef.current;
    const selection = element.selectionStart;
    if (selection === null) return null;

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    if (element.tagName === "TEXTAREA") {
      const div = document.createElement("div");

      [
        "fontFamily",
        "fontSize",
        "fontWeight",
        "letterSpacing",
        "lineHeight",
        "padding",
        "border",
      ].forEach((prop) => {
        div.style[prop as any] = style[prop as any];
      });

      div.style.position = "absolute";
      div.style.visibility = "hidden";
      div.style.whiteSpace = "pre-wrap";
      div.style.wordWrap = "break-word";
      div.style.width = element.offsetWidth + "px";
      div.style.height = "auto";
      div.style.overflow = "hidden";

      const text = element.value.substring(0, selection);
      div.textContent = text;

      const span = document.createElement("span");
      span.textContent = "|";
      div.appendChild(span);

      document.body.appendChild(div);

      const spanRect = span.getBoundingClientRect();
      const divRect = div.getBoundingClientRect();

      document.body.removeChild(div);

      return {
        x: rect.left + (spanRect.left - divRect.left),
        y: rect.top + (spanRect.top - divRect.top) + spanRect.height,
        width: rect.width,
        height: spanRect.height,
      };
    } else {
      const textMetrics = element.value.substring(0, selection);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        context.font = `${style.fontSize} ${style.fontFamily}`;
        const textWidth = context.measureText(textMetrics).width;
        return {
          x: rect.left + parseInt(style.paddingLeft) + textWidth,
          y: rect.bottom,
          width: rect.width,
          height: rect.height,
        };
      }
    }

    return {
      x: rect.left,
      y: rect.bottom,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  const handleInputChange = useCallback(
    (value: string, selectionStart: number) => {
      if (!textareaRef.current) return;

      const beforeCursor = value.substring(0, selectionStart);
      const match = beforeCursor.match(/\{([^}]*)$/);

      if (match) {
        const searchTerm = match[1].toLowerCase();
        const filtered = variables
          .filter((variable) => variable.toLowerCase().includes(searchTerm))
          .sort((a, b) => {
            const aLower = a.toLowerCase();
            const bLower = b.toLowerCase();
            const aStartsWith = aLower.startsWith(searchTerm);
            const bStartsWith = bLower.startsWith(searchTerm);

            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;

            return aLower.localeCompare(bLower);
          });

        if (filtered.length > 0) {
          setSuggestions(filtered);
          setQuery(searchTerm);
          setSelectedIndex(0);
          setIsVisible(true);

          const pos = getCaretPosition();
          if (pos) setPosition(pos);
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    },
    [variables, getCaretPosition]
  );

  const updatePosition = useCallback(() => {
    if (isVisible && textareaRef.current) {
      const pos = getCaretPosition();
      if (pos) setPosition(pos);
    }
  }, [isVisible, getCaretPosition]);

  const scrollToSelected = useCallback((index: number) => {
    if (!autocompleteRef.current) return;

    const container = autocompleteRef.current;
    const item = container.children[0]?.children[index] as HTMLElement;

    if (item) {
      item.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, []);

  const selectSuggestion = useCallback(
    (variable: string) => {
      if (!textareaRef.current) return;

      const element = textareaRef.current;
      const value = element.value;
      const selectionStart = element.selectionStart;

      if (selectionStart === null) return;

      const beforeCursor = value.substring(0, selectionStart);
      const afterCursor = value.substring(selectionStart);
      const match = beforeCursor.match(/\{([^}]*)$/);

      if (match) {
        const startIndex = beforeCursor.lastIndexOf("{");
        const newValue =
          beforeCursor.substring(0, startIndex) + `{${variable}}` + afterCursor;
        const newCursorPos = startIndex + variable.length + 2;

        onSelect(newValue);
        setIsVisible(false);

        setTimeout(() => {
          element.setSelectionRange(newCursorPos, newCursorPos);
          element.focus();
        }, 0);
      }
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      if (!isVisible || suggestions.length === 0) return;

      switch (keyEvent.key) {
        case "ArrowDown":
          keyEvent.preventDefault();
          setSelectedIndex((prev) => {
            const newIndex = (prev + 1) % suggestions.length;
            setTimeout(() => scrollToSelected(newIndex), 0);
            return newIndex;
          });
          break;
        case "ArrowUp":
          keyEvent.preventDefault();
          setSelectedIndex((prev) => {
            const newIndex = prev === 0 ? suggestions.length - 1 : prev - 1;
            setTimeout(() => scrollToSelected(newIndex), 0);
            return newIndex;
          });
          break;
        case "Enter":
        case "Tab":
          keyEvent.preventDefault();
          selectSuggestion(suggestions[selectedIndex]);
          break;
        case "Escape":
          keyEvent.preventDefault();
          setIsVisible(false);
          break;
      }
    },
    [isVisible, suggestions, selectedIndex, selectSuggestion, scrollToSelected]
  );

  useEffect(() => {
    const element = textareaRef.current;
    if (element) {
      element.addEventListener("keydown", handleKeyDown);
      return () => element.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();

      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isVisible, updatePosition]);

  return {
    textareaRef,
    autocompleteRef,
    suggestions,
    selectedIndex,
    position,
    isVisible,
    handleInputChange,
    selectSuggestion,
    scrollToSelected,
  };
};
