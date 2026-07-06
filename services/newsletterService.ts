// Service for managing newsletter registrations (email subscriptions)

const STORAGE_KEY = 'istudent_newsletter_emails';

const defaultEmails = [
  'hoangnam.hcmut@gmail.com',
  'thutrang.ftu2@gmail.com',
  'khanhlinh.med@gmail.com',
  'quanghuy.uit@gmail.com',
  'minhanh.ueh@gmail.com'
];

export class NewsletterService {
  static getEmails(): string[] {
    if (typeof window === 'undefined') return defaultEmails;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEmails));
      return defaultEmails;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      return defaultEmails;
    }
  }

  static addEmail(email: string): boolean {
    if (typeof window === 'undefined') return false;
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) return false;

    const emails = this.getEmails();
    if (emails.includes(trimmed)) return false;

    emails.unshift(trimmed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
    return true;
  }

  static deleteEmail(email: string): boolean {
    if (typeof window === 'undefined') return false;
    const emails = this.getEmails();
    const filtered = emails.filter(e => e !== email.trim().toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
}
