import authUsers from '../auth/users.json';
import adminOnlyAccess from '../access/admin-only.json';
import apiKeyReadonlyAccess from '../access/api-key-readonly.json';

const expectAccessRecordShape = (record: any) => {
  expect(record).toEqual(
    expect.objectContaining({
      email: expect.stringContaining('@'),
      appName: expect.any(String),
      endPointName: expect.any(String),
      isAllowed: expect.stringMatching(/^(true|false)$/),
      allowedInChain: expect.any(Boolean),
    })
  );
};

describe('beta fixture shapes', () => {
  it('includes safe auth user fixtures for local simulations', () => {
    expect(authUsers.users).toHaveLength(3);

    for (const user of authUsers.users) {
      expect(user).toEqual(
        expect.objectContaining({
          email: expect.stringContaining('@'),
          firstName: expect.any(String),
          lastName: expect.any(String),
          password: expect.any(String),
          role: expect.stringMatching(/^(admin|user)$/),
          isVerified: expect.any(Boolean),
          isBlocked: expect.any(Boolean),
        })
      );
      expect(user.password).not.toContain('dev-only-change-me');
    }
  });

  it('includes admin-only access fixtures', () => {
    expect(adminOnlyAccess.records).toHaveLength(4);
    adminOnlyAccess.records.forEach(expectAccessRecordShape);
    expect(adminOnlyAccess.records.some((record) => record.isAllowed === 'false')).toBe(true);
  });

  it('includes read-only API-key access fixtures', () => {
    expect(apiKeyReadonlyAccess.apiKeyUser).toEqual(
      expect.objectContaining({
        email: 'api-reader@example.com',
        apiKey: expect.any(String),
      })
    );
    apiKeyReadonlyAccess.records.forEach(expectAccessRecordShape);
    expect(apiKeyReadonlyAccess.records.filter((record) => record.isAllowed === 'true')).toHaveLength(2);
    expect(apiKeyReadonlyAccess.records.filter((record) => record.isAllowed === 'false')).toHaveLength(3);
  });
});

