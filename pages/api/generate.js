import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  " Write a successful Innovate UK grant application for the question asked. Brielfy include the most relevant benefit of solving the problem in UK based on the impact in quantified numbers, mentioning the source. Write the word count";
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}\n`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.5,
    max_tokens: 500,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = `
  Make the input flow with very concise with specific descriptions of the proposal, the problem, right team to deliver it, the commercial opportunity, specific UN SDG benefit and why public funding is necessary. Use only British English spelling. The number of words must be between 97% and 100% of the word count provided.
   Title: ${req.body.userInput}
 
   Application:
   `;

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.6,
    // I also increase max_tokens.
    max_tokens: 1800,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
