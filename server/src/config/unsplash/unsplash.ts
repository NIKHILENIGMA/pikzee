import dotenv from 'dotenv';
import { logger } from "../logger";

dotenv.config();

export const unsplashConfig = {
    accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
    secretKey: process.env.UNSPLASH_SECRET_KEY || ''
}


// Define the shape of the expected Unsplash response
interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

export interface IUnsplashService {
    getRandomPhoto(query?: string): Promise<UnsplashPhoto | null>;
}

export class UnsplashService implements IUnsplashService {
  private readonly baseUrl: string = 'https://api.unsplash.com';
  private readonly accessKey: string;

  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }

  /**
   * Fetches a single random photo from Unsplash
   * @param query Optional keyword to filter the random photo (e.g., 'nature')
   */
  async getRandomPhoto(query?: string): Promise<UnsplashPhoto | null> {
    const endpoint = new URL(`${this.baseUrl}/photos/random`);
    
    // Append necessary parameters
    endpoint.searchParams.append('client_id', this.accessKey);
    if (query) {
      endpoint.searchParams.append('query', query);
    }

    try {
      const response = await fetch(endpoint.toString());
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`);
      }

      const data: UnsplashPhoto = await response.json();
      return data;
    } catch (error) {
      logger.error(`Failed to fetch image from Unsplash: ${error}`);
      return null;
    }
  }
}


