declare module 'xml-stream' {
    import { Readable } from 'stream';

    interface XmlStreamOptions {
        trim?: boolean;
        normalize?: boolean;
        normalizeTags?: boolean;
        attributeNamePrefix?: string;
    }

    class XmlStream {
        constructor(stream: Readable, options?: XmlStreamOptions);
        collect(tag: string): void;
        on(event: string, callback: (...args: any[]) => void): void;
    }

    export = XmlStream;
}
