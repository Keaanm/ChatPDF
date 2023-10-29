type Message = {
    id: number;
    createAt: Date;
    text: string;
    isUserMessage: boolean;
    streamId: string | null;
};

type Omits = Omit<Message, "text" | "id">;

type Extends = {
    text: string | JSX.Element;
    id: string | number;
};

export type ExtendedMessage = Omits & Extends;