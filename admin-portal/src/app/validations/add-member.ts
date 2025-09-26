export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isMatchingPasswords(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
}

export function hasEmptyFields(obj: any): boolean {
    return Object.values(obj).some(v =>
        v === null ||
        v === undefined ||
        (typeof v === 'string' ? v.trim() === '' : v === '')
    );
}