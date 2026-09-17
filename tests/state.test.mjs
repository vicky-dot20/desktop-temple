import test from 'node:test';
import assert from 'node:assert/strict';
import {shouldWelcome,dayKey,smoothstep} from '../src/state.js';
test('welcome only once per local calendar day',()=>{const date=new Date(2026,8,17,8);assert.equal(shouldWelcome(true,'',date),true);assert.equal(shouldWelcome(true,dayKey(date),date),false);assert.equal(shouldWelcome(true,dayKey(date),new Date(2026,8,18,8)),true);assert.equal(shouldWelcome(false,'',date),false);});
test('camera transition clamps and lands at endpoints',()=>{assert.equal(smoothstep(-1),0);assert.equal(smoothstep(0),0);assert.equal(smoothstep(.5),.5);assert.equal(smoothstep(1),1);assert.equal(smoothstep(2),1);});
