import { faker } from '@faker-js/faker'
import userSchema from '../models/user-schema.js';
import noteSchema from '../models/notes-schema.js';

const dummyNotes = async (num) => {
  const notes = [];
  const allUsers = await userSchema.find()
  for (let i = 1; i <= num; i++) {
    const title = faker.internet.username();
    const description = faker.internet.username();
    const userId = allUsers[Math.floor(Math.random() * allUsers.length)]._id
    let author = await (userSchema.findById({ _id: userId }))
    author = author.userName
    notes.push({
      title,
      description,
      userId,
      author
    });
  }
  try {
    await noteSchema.insertMany(notes)
    console.log(`${num} notes have been inserted in the userSchema`)
  }
  catch (error) {
    console.log(error)
  }
};

export default dummyNotes

