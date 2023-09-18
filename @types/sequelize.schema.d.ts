declare global {
  type MySQLSchemaInput = {
    [key: string]: MySQLSchemaFields;
  };

  type MySQLSchemaFields = {
    required?: boolean | false;
    type: string;
    isArray?: boolean | false;
    enums?: string;
    defaultValue?: string;
    isNullable?: boolean | false;
    isIndex?: boolean | false;
    isUnique?: boolean | false | 'compositeIndex';
    isSparse?: boolean | false;
    isPrimaryKey?: boolean | false;
    autoIncrement?: boolean | false;
    ref?: referenceType;
  };

  interface referenceType {
    to: string;
    type: 'hasOne' | 'belongsTo' | 'hasMany' | 'belongsToMany';
    options: hasOneType | belongsToType | hasManyType | belongsToManyType;
  }

  interface hasOneType {
    onDelete?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    foreignKey: string | foreignKeyOptions;
    as: string;
  }

  interface foreignKeyOptions {
    allowNull: boolean;
    type: string;
    defaultValue: string;
  }

  interface belongsToType {
    onDelete?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    foreignKey: string | foreignKeyOptions;
    as: string;
  }

  interface hasManyType {
    onDelete?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    foreignKey: string | foreignKeyOptions;
    as: string;
  }

  interface belongsToManyType {
    onDelete?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    foreignKey: string | foreignKeyOptions;
    throughKey: string;
    as: string;
  }
}

export {};
