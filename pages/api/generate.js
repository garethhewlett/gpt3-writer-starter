import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  "Write a successful Innovate UK grant application using the word count and description provided below. Use only British spelling and assume no prior knowledge of the topic. It should excite the reader. Include quantitive evidence about the problem in the UK mentioning the source";
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}\n`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.55,
    max_tokens: 400,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = `
   Avoid repetition. Quantified the UK and international commercial opportunity including sources. Explain how it helps specific UN SDG's and either the UK GDP or UK productivity.
   Title: ${req.body.userInput}
 
   Table of Contents: ${basePromptOutput.text}
 
   Application:
   `;

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.65,
    // I also increase max_tokens.
    max_tokens: 1500,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
