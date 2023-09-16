declare global {
  type MySQLSchemaInput = {
    [key: string]: MySQLSchemaFields;
  };

  type MySQLSchemaFields = {
    required: boolean | false;
    type: string;
    isArray: boolean | false;
    enums: string | undefined | null;
    defaultValue: string | undefined;
    isNullable: boolean | false;
    isIndex: boolean | false;
    isUnique: boolean | false | 'compositeIndex';
    isSparse: boolean | false;
    isPrimaryKey: boolean | false;
    autoIncrement: boolean | false;
    ref: referenceType;
  };

  interface referenceType {
    to: string;
    type: 'hasOne' | 'belongsTo' | 'hasMany' | 'belongsToMany';
    options: hasOneType | belongsToType | hasManyType | belongsToManyType;
  }

  interface hasOneType {
    onDelete: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    onUpdate: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    foreignKey: string | foreignKeyOptions;
  }

  interface foreignKeyOptions {
    allowNull: boolean;
    type: string;
    defaultValue: string;
  }

  interface belongsToType {
    onDelete: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    onUpdate: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    foreignKey: string | foreignKeyOptions;
  }

  interface hasManyType {
    onDelete: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    onUpdate: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    foreignKey: string | foreignKeyOptions;
  }

  interface belongsToManyType {
    onDelete: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    onUpdate: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION' | 'RESTRICT';
    foreignKey: string | foreignKeyOptions;
    throughKey: string;
  }
}

export {};
