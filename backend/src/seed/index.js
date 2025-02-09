import express from 'express'
import { connectDB } from '../config/db-connection.js';
import noteSchema from "../models/notes-schema.js";
import userSchema from "../models/user-schema.js";
import sessionSchema from '../models/session-schema.js';
import dummyUser from '../seed/dummyUser.js';
import dummyNotes from '../seed/dummyNotes.js';
import mongoose from 'mongoose';


async function reset () {
    connectDB();
    await noteSchema.deleteMany();
    await userSchema.deleteMany();
    await sessionSchema.deleteMany();
    console.log('Database reset');
}

async function createDummy() {
   await dummyUser(100)
   await dummyNotes(100)
   mongoose.connection.close()
}

await reset()
createDummy()

