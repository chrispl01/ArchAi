import { Completion } from '../dtos/Completion';
import { Prompt } from '../dtos/Prompt';
import axios from 'axios';

export async function fetchTerraformCode(prompt: Prompt): Promise<Completion> {
  try {
    const response = await axios.post<Completion>(
      'http://localhost:5000/ArchAi/getCompletion',
      prompt,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );


    return response.data;
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      if (error.response.status === 429) {
        throw new Error('Request Limit reached!');
      } else if (error.response.status >= 400 && error.response.status < 500) {
        throw new Error('Invalid input! Please try again!');
      } else if (error.response.status >= 500) {
        throw new Error('Internal server error occured!');
      }
    }
    throw new Error('Error occured! Try again!');
  }
}
