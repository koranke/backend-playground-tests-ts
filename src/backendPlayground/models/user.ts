export class User {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public dateOfBirth: Date
    ) {}

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}