import { describe, it, expect } from 'vitest';
import { JaaqClient, createJaaqClient } from '@src/index';

describe('SDK initialization equivalence', () => {
  it('JaaqClient.init and createJaaqClient produce equivalent clients', () => {
    const config = {
      apiKey: 'test-key',
      clientId: 'acme',
    } as const;

    const clientFromInit = JaaqClient.init(config);
    const clientFromFactory = createJaaqClient(config);

    // Same public shape
    expect(Object.keys(clientFromInit)).toEqual(expect.arrayContaining(['videos', 'collections']));
    expect(Object.keys(clientFromFactory)).toEqual(expect.arrayContaining(['videos', 'collections']));

    // Behavior-level equivalence: both expose same methods on resources
    expect(typeof clientFromInit.videos.getById).toBe('function');
    expect(typeof clientFromFactory.videos.getById).toBe('function');
    expect(typeof clientFromInit.collections.list).toBe('function');
    expect(typeof clientFromFactory.collections.list).toBe('function');

    // They are different instances but same class
    expect(clientFromInit).not.toBe(clientFromFactory);
    expect(clientFromInit.constructor.name).toBe(clientFromFactory.constructor.name);
  });
});
