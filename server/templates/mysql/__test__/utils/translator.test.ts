import { describe, test, expect } from '@jest/globals';
import { Op, Sequelize } from 'sequelize';
import {
  translateQueryToSequelize,
  translateAttributesToSequelize,
  translateWhereToSequelize,
} from '../../utils/translator';

describe('translate Query To Sequelize', () => {
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
    const connection2 = Sequelize;
    const expectedQuery2 = {
      where: { status: 'active' },
      attributes: ['name'],
      order: [['createdAt', 'DESC']],
      limit: 5,
      offset: 10,
    };
    expect(translateQueryToSequelize(jsonQuery2, connection2)).toEqual(expectedQuery2);

    // Test case 3
    const input3 = ['foo', ["$fn('COUNT', $col('hats'))", 'n_hats'], 'bar'];
    const connection3 = Sequelize;
    const output3 = ['foo', [Sequelize.fn('COUNT', Sequelize.col('hats')), 'n_hats'], 'bar'];
    expect(translateAttributesToSequelize(input3, connection3)).toEqual(output3);

    // Test case 4
    const input4 = "$where($fn('char_length', $col('content')), 7)";
    const connection4 = Sequelize;
    const output4 = Sequelize.where(Sequelize.fn('char_length', Sequelize.col('content')), 7);
    expect(translateWhereToSequelize(input4, connection4)).toEqual(output4);

    // Test case 5
    const input5 = {
      where: "$where($fn('char_length', $col('content')), 7)",
    };
    const connection5 = Sequelize;
    const output5 = {
      where: Sequelize.where(Sequelize.fn('char_length', Sequelize.col('content')), 7),
      limit: 20,
    };
    expect(translateQueryToSequelize(input5, connection5)).toEqual(output5);
  });
});
