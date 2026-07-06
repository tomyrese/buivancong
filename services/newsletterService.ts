// Service for managing newsletter registrations (email subscriptions)

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}

const STORAGE_KEY = 'istudent_newsletter_emails_v2';

export class NewsletterService {
  static getEmails(): NewsletterSubscription[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }

  static addEmail(email: string): boolean {
    if (typeof window === 'undefined') return false;
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) return false;

    const subscriptions = this.getEmails();
    if (subscriptions.some(s => s.email === trimmed)) return false;

    const newSub: NewsletterSubscription = {
      email: trimmed,
      subscribedAt: new Date().toISOString()
    };

    subscriptions.unshift(newSub);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    return true;
  }

  static deleteEmail(email: string): boolean {
    if (typeof window === 'undefined') return false;
    const subscriptions = this.getEmails();
    const filtered = subscriptions.filter(s => s.email !== email.trim().toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
}
