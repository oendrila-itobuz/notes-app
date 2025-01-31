import { faker } from '@faker-js/faker'
import userSchema from '../models/user-schema.js';

const dummyUser = async (num) => {
  const users = [];

  for (let i = 1; i <= num; i++) {
    const userName = faker.name.firstName();
    const password = `user_${i}@TY`;
    const email = `oendrila+${i}@itobuz.com`;
    const verified = true;

    users.push({
      userName,
      password,
      email,
      verified,
    });
  }
  try{
     await userSchema.insertMany(users)
     console.log(`${num} users have been inserted in the userSchema`)
  }
  catch(error){
     console.log(error)
  }
};

export default dummyUser

