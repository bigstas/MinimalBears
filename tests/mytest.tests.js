import { mocha } from 'meteor/avital:mocha';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import laserPointer from './cat-stuff.js';

describe( 'Cat Stuff', () => {
   it( 'draws a laser pointer\'s position as a number', () => {
     let laser = laserPointer();
     assert.typeOf( laser.position, 'number' );
   });
});