interface LoginResult {
    token: string;
    user: { userId: string; email: string };
    insured?: { insuredId: string; fullName: string };
}