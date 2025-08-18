export class User {
    constructor(
        public userId: string,
        public email: string,
        public insuredId: string,
        public passwordHash: string
    ) { }
};