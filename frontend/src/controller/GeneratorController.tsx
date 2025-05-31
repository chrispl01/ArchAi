import { Completion } from '@/models/dtos/Completion';
import { fetchTerraformCode } from '../models/services/TerraformService ';
import { Prompt } from '@/models/dtos/Prompt';

export async function getCode(prompt: Prompt) : Promise<Completion> {
    const a = await fetchTerraformCode(prompt);
    return a;
}
