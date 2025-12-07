
import express from 'express';


declare namespace Express {
    export interface Request {
        user?: { userId: string; role: string };
    }
}