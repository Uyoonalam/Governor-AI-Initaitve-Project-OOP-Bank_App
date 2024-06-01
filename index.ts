#!/usr/bin/env node

import inquirer from "inquirer";

interface BankAccount {
  accountNumber: number;
  firstName: string;
  lastName: string;
  accountBalance: number;
  withdraw(amount: number): void;
  deposit(amount: number): void;
  balanceInquiry(): void;
}

class BankAccount implements BankAccount {
  accountNumber: number;
  firstName: string;
  lastName: string;
  accountBalance: number;

  constructor(
    accountNumber: number,
    firstName: string,
    lastName: string,
    accountBalance: number
  ) {
    this.accountBalance = accountBalance;
    this.firstName = firstName;
    this.lastName = lastName;
    this.accountNumber = accountNumber;
  }

  withdraw(amount: number): void {
    if (this.accountBalance >= amount) {
      this.accountBalance -= amount;
      console.log(`You have successfully withdrawn $${amount}`);
    } else {
      console.log("You have insufficient balance");
    }
    console.log(`Remaining balance: $${this.accountBalance}`);
  }

  deposit(amount: number): void {
    let afterDeposit = this.accountBalance + amount;
    if (amount >= 100) {
      afterDeposit = this.accountBalance + (amount - ((amount * 5) / 100));
    }
    this.accountBalance = afterDeposit;
    console.log(`You have successfully deposited $${amount}`);
    console.log(`Current balance: $${this.accountBalance}`);
  }

  balanceInquiry(): void {
    console.log(`Current Balance: $${this.accountBalance}`);
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const accountDetails = await inquirer.prompt([
    {
      name: "accountNumber",
      type: "input",
      message: "Please enter account number",
      validate: (input: string) => {
        const num = Number(input);
        if (isNaN(num) || num.toString().length < 8 || num.toString().length > 10) {
          return "Account number must be a number with 8-10 digits.";
        }
        return true;
      }
    },
    {
      name: "firstName",
      type: "input",
      message: "Please enter first name",
      validate: (input: string) => {
        if (!input.trim()) {
          return "First name cannot be empty.";
        }
        return true;
      }
    },
    {
      name: "lastName",
      type: "input",
      message: "Please enter last name",
      validate: (input: string) => {
        if (!input.trim()) {
          return "Last name cannot be empty.";
        }
        return true;
      }
    },
  ]);

  const accountNumber = Number(accountDetails.accountNumber);
  const firstName = accountDetails.firstName;
  const lastName = accountDetails.lastName;
  const initialBalance = 100;

  const account = new BankAccount(accountNumber, firstName, lastName, initialBalance);

  console.log(`Welcome ${firstName} ${lastName}`);
  await delay(1000);
  console.log(`Account Number: ${accountNumber}`);
  await delay(1000);
  console.log("You have $100");
  await delay(1000);

  while (true) {
    const bankFunctions = await inquirer.prompt({
      name: "requiredFunction",
      type: "list",
      message: "What do you want to do?",
      choices: ["Deposit Amount", "Withdraw Amount", "Balance Inquiry", "Cancel Operation"]
    });

    if (bankFunctions.requiredFunction === "Deposit Amount") {
      const ans = await inquirer.prompt({
        name: "amount",
        type: "number",
        message: "Write the amount you want to Deposit",
        validate: (input: string) => {
          const num = Number(input);
          if (isNaN(num) || num <= 0) {
            return "Please enter a valid positive number.";
          }
          return true;
        }
      });
      const amountToDeposit = Number(ans.amount);
      await delay(2500);
      account.deposit(amountToDeposit);
    } else if (bankFunctions.requiredFunction === "Withdraw Amount") {
      const ans = await inquirer.prompt({
        name: "amount",
        type: "number",
        message: "Write the amount you want to Withdraw",
        validate: (input: string) => {
          const num = Number(input);
          if (isNaN(num) || num <= 0) {
            return "Please enter a valid positive number.";
          }
          return true;
        }
      });
      const amountToWithdraw = Number(ans.amount);
      await delay(2500);
      account.withdraw(amountToWithdraw);
    } else if (bankFunctions.requiredFunction === "Balance Inquiry") {
      await delay(1500);
      account.balanceInquiry();
    } else if (bankFunctions.requiredFunction === "Cancel Operation") {
      console.log("Operation Cancelled");
      await delay(1500);
      break;
    }
    console.log("Thank you for using our service!");
    console.log("\n\n");
    await delay(1500);
  }
})();
