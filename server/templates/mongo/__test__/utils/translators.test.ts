import mongoose from 'mongoose';
import { translateFilter } from '../../utils/translators';

const { ObjectId, DBRef } = mongoose.mongo;

describe('translateFilter', () => {
  it('should translate string values starting with "ObjectId(" to ObjectId values', () => {
    const filter = {
      name: 'ObjectId(64df11660f6498cd0a019a12)',
      age: 'ObjectId(64df11660f6498cd0a019a13)',
      address: {
        city: 'ObjectId(64df11660f6498cd0a019a14)',
      },
    };
    const expected = {
      name: new ObjectId('64df11660f6498cd0a019a12'),
      age: new ObjectId('64df11660f6498cd0a019a13'),
      address: {
        city: new ObjectId('64df11660f6498cd0a019a14'),
      },
    };

    const result = translateFilter(filter);

    expect(result).toEqual(expected);
  });

  it('should translate string values starting with "DbRef(" to DBRef values', () => {
    const filter = {
      name: 'DbRef(collectionName, 64df11660f6498cd0a019a12)',
      age: 'DbRef(collectionName, 64df11660f6498cd0a019a13)',
      address: {
        city: 'DbRef(collectionName, 64df11660f6498cd0a019a14)',
      },
    };
    const expected = {
      name: new DBRef('collectionName', new ObjectId('64df11660f6498cd0a019a12')),
      age: new DBRef('collectionName', new ObjectId('64df11660f6498cd0a019a13')),
      address: {
        city: new DBRef('collectionName', new ObjectId('64df11660f6498cd0a019a14')),
      },
    };

    const result = translateFilter(filter);

    expect(result).toEqual(expected);
  });

  it('should not translate other types of values', () => {
    const filter = {
      name: 'John',
      age: 25,
      address: {
        city: 'New York',
      },
    };

    const result = translateFilter(filter);

    expect(result).toEqual(filter);
  });

  it('should handle empty arrays', () => {
    const filter = {
      array: [],
    };

    const result = translateFilter(filter);

    expect(result).toEqual(filter);
  });

  it('should handle arrays with non-string elements', () => {
    const filter = {
      array: [1, 2, 3],
    };

    const result = translateFilter(filter);

    expect(result).toEqual(filter);
  });

  it('should handle arrays with string elements that do not start with "ObjectId("', () => {
    const filter = {
      array: ['John', 'Doe'],
    };

    const result = translateFilter(filter);

    expect(result).toEqual(filter);
  });

  it('should handle empty objects', () => {
    const filter = {};

    const result = translateFilter(filter);

    expect(result).toEqual(filter);
  });

  it('should handle objects with non-string values', () => {
    const filter = {
      name: 'John',
      age: 25,
      address: {
        city: 'New York',
      },
    };
    const result = translateFilter(filter);
    expect(result).toEqual(filter);
  });

  it('should handle objects with string values that do not start with "ObjectId(" or "DbRef("', () => {
    const filter = {
      name: 'John',
      age: '25',
      address: {
        city: 'New York',
      },
    };

    const result = translateFilter(filter);

    expect(result).toEqual(filter);
  });
});
