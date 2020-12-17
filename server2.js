import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import jieba from '@node-rs/jieba'
import fs from 'fs'

import App from './index.js'
import FallbackApp from './fallback/fallback_app.js'

import mongoose from 'mongoose'

const { Schema } = mongoose

const appPoiCode = 't_fLkr2jOW5A'

jieba.loadDict(fs.readFileSync('user.dict'))




