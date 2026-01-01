const pastelApiGrey = '\x1b[38;5;252m';
const grey = '\x1b[38;5;245m';
const reset = '\x1b[0m';

class Logger {
    private static readonly prefixColor = pastelApiGrey;
    private static readonly messageColor = grey;
    private static readonly reset = reset;

    private static formatMessage(level: string, message: string): string {
        const timestamp = new Date().toISOString().slice(11, 19);
        return `${this.prefixColor}[${timestamp}] [API] ${level}${this.reset} ${this.messageColor}${message}${this.reset}`;
    }

    public static info(message: string): void {
        console.log(this.formatMessage('INFO', message));
    }

    public static error(message: string): void {
        console.log(this.formatMessage('ERROR', message));
    }

    public static warn(message: string): void {
        console.log(this.formatMessage('WARN', message));
    }

    public static debug(message: string): void {
        if (process.env.NODE_ENV === 'development') {
            console.log(this.formatMessage('DEBUG', message));
        }
    }
}

export const logger = Logger;