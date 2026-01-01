import { useVariableAutocomplete } from "@/hooks/useVariableAutocomplete";
import { VariableAutocomplete } from "./VariableAutocomplete";

type VariableInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
  type?: "text" | "textarea";
};

export const VariableInput = ({
  value,
  onChange,
  className,
  placeholder,
  rows,
  type = "text",
}: VariableInputProps) => {
  const {
    textareaRef,
    autocompleteRef,
    suggestions,
    selectedIndex,
    position,
    isVisible,
    handleInputChange,
    selectSuggestion,
  } = useVariableAutocomplete(onChange);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    const selectionStart = e.target.selectionStart || 0;
    onChange(newValue);
    handleInputChange(newValue, selectionStart);
  };

  const handleClick = (
    e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const selectionStart = target.selectionStart || 0;
    handleInputChange(value, selectionStart);
  };

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(e.key)) {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const selectionStart = target.selectionStart || 0;
      handleInputChange(value, selectionStart);
    }
  };

  const commonProps = {
    ref: textareaRef,
    value,
    onChange: handleChange,
    onClick: handleClick,
    onKeyUp: handleKeyUp,
    className,
    placeholder,
    autoComplete: "off",
    spellCheck: false,
  };

  return (
    <div className="relative select-none">
      {type === "textarea" ? (
        <textarea
          {...commonProps}
          rows={rows}
          ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
        />
      ) : (
        <input
          {...commonProps}
          type="text"
          ref={textareaRef as React.RefObject<HTMLInputElement>}
        />
      )}

      <VariableAutocomplete
        suggestions={suggestions}
        selectedIndex={selectedIndex}
        position={position}
        isVisible={isVisible}
        onSelect={selectSuggestion}
        autocompleteRef={autocompleteRef}
      />
    </div>
  );
};
