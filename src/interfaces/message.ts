export interface Message {
    sender: string;
    recipient: string;
    content: string;
    productId: string;
    timestamp?: string;
}