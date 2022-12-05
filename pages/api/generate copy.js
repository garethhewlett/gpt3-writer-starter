import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  "Write a successful Innovate UK grant application using the word count and section description provided below. Use only British spelling and do not assume prior knowledge of the topic. It should excite the reader about the innovation benefits to its customers, sustainability and either the UK GDP or productivity. Include quantitive evidence about the problem in the UK mentioning the source, and describe how the applicant can make it a commercial success in UK and internationally.";
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}\n`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.56,
    max_tokens: 1150,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
