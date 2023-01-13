#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';
import cmc from 'clear-my-console';
import axios from 'axios';

const baseUrl = 'https://ask-me-anything-ehws.onrender.com/';

const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    'Welcome to ChatGPT CLI version. Powered by OpenAi and developed by CSAlam07\n',
  );

  await sleep();
  rainbowTitle.stop();
}

const askQuestion = async () => {
  const { question } = await inquirer.prompt([
    {
      type: 'input',
      name: 'question',
      message: chalk.bgCyanBright('You : '),
      default: 'what is ChatGPT',
    },
  ]);
  return question;
};

const sendRequest = async (question) => {
  const spinner = createSpinner().start();
  await sleep();
  try {
    const response = await axios.post(baseUrl, {
      promtData: question,
    });
    if (response.status === 200) {
      spinner.stop();
      const data = response.data.bot;
      const parsedData = data.substring(data.indexOf('\n') + 1);
      console.group(chalk.bgCyanBright('ChatGPT : '));
      console.log(gradient('cyan', 'pink')(parsedData));
      console.groupEnd();
      console.log('\n');
    }
  } catch (error) {
    console.error(error);
    spinner.stop();
  }
};

const main = async () => {
  cmc();
  await welcome();
  while (true) {
    const question = await askQuestion();
    if (question === 'exit') {
      break;
    }
    await sendRequest(question);
  }
};

main();
