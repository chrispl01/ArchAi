import { Completion } from '../dtos/Completion';
import { Prompt } from '../dtos/Prompt';
import axios from 'axios';

export async function fetchTerraformCode(prompt: Prompt): Promise<Completion> {
  try {
    const response = await axios.post<Completion>(
      'https://archai.chrispl.com/api/ArchAi/getCompletion',
      prompt,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );


    return response.data;
  } catch (error) {
  console.log(error);

  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'status' in error.response
  ) {
    const status = (error.response as { status: number }).status;

    if (status === 429) {
      throw new Error('Request Limit reached!');
    } else if (status >= 400 && status < 500) {
      throw new Error('Invalid input! Please try again!');
    } else if (status >= 500) {
      throw new Error('Internal server error occured!');
    }
  }

  throw new Error('Error occured! Try again!');
}
}
