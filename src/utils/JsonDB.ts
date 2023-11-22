import { promises as fs } from 'fs';
import { dirname } from 'path';

export class JsonDB {
    constructor(private filePath: string) {}

    async readData<T>(): Promise<T[]> {
        try {
            await fs.access(this.filePath);
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error: unknown) {
            if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
                // Tenta criar o diretório se ele não existir
                await this.ensureDirectoryExistence(this.filePath);
                // Se o arquivo não existir, crie um novo arquivo com um array vazio
                await fs.writeFile(this.filePath, JSON.stringify([]));
                return [];
            } else {
                // Se for outro tipo de erro, lance-o novamente
                throw error;
            }
        }
    }

    async writeData<T>(data: T[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    private async ensureDirectoryExistence(filePath: string): Promise<void> {
        const dir = dirname(filePath);
        try {
            await fs.access(dir);
        } catch (error) {
            if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
                await fs.mkdir(dir, { recursive: true });
            } else {
                throw error;
            }
        }
    }
}
