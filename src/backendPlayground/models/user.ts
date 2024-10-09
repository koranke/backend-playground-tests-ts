export class User {
    constructor(
        public id: number | null,
        public firstName: string | null,
        public lastName: string | null,
        public email: string,
        public phone: string | null,
        public dateOfBirth: string | null
    ) {}

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`
    }
}