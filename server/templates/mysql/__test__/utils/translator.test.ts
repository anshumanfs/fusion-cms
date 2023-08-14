import { describe, test, expect } from '@jest/globals';
import { Op, Sequelize } from 'sequelize';
import translateQueryToSequelize from '../../utils/translator';

describe('translateQueryToSequelize', () => {
  test('should return the translated Sequelize query object', () => {
    // Test case 1
    const jsonQuery1 = {
      where: {
        name: 'John',
        age: { 'Op.gt': 18 },
      },
      attributes: ['name', 'age'],
      order: [['name', 'ASC']],
      group: 'department',
      limit: 10,
      offset: 0,
    };
    const connection1 = Sequelize;
    const expectedQuery1 = {
      where: { name: 'John', age: { [Op.gt]: 18 } },
      attributes: ['name', 'age'],
      order: [['name', 'ASC']],
      group: 'department',
      limit: 10,
    };
    expect(translateQueryToSequelize(jsonQuery1, connection1)).toEqual(expectedQuery1);

    // Test case 2
    const jsonQuery2 = {
      where: {
        status: 'active',
      },
      attributes: ['name'],
      order: [['createdAt', 'DESC']],
      limit: 5,
      offset: 10,
    };
    const connection2 = {
      /* mock connection object */
    };
    const expectedQuery2 = {
      where: { status: 'active' },
      attributes: ['name'],
      order: [['createdAt', 'DESC']],
      limit: 5,
      offset: 10,
    };
    expect(translateQueryToSequelize(jsonQuery2, connection2)).toEqual(expectedQuery2);
  });
});
