import { faker } from '@faker-js/faker'
import userSchema from '../models/user-schema.js';
import bcrypt from 'bcrypt'

const dummyUser = async (num) => {
  const users = [];

  for (let i = 1; i <= num; i++) {
    const userName = faker.internet.username();
    let password = `user_${i}@TY`;
    const salt = await bcrypt.genSalt(10);

    const email = `oendrila+${i}@itobuz.com`;
    const verified = true;

    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword

    users.push({
      userName,
      password,
      email,
      verified,
    });
  }
  try {
    await userSchema.insertMany(users)
    console.log(`${num} users have been inserted in the userSchema`)
  }
  catch (error) {
    console.log(error)
  }
};

export default dummyUser

