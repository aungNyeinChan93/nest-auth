/* eslint-disable prettier/prettier */

import { Provider } from "@nestjs/common";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema'
import { DrizzleService } from "../drizzle.service";

export const DrizzleProvider: Provider = {
    provide: 'DRIZZLE',
    useFactory() {
        const pg = neon(process.env.DATABASE_URL!);
        const db = drizzle({ client: pg, schema: schema });
        return db;
    },
    inject: [DrizzleService]
}