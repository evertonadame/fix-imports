import * as myExtension from "../extension";

export const firstSuite = {
  name: "First Suite",
  libs: [
    {
      lib: "@my-design-system-lib",
      endPath: "dist/components",
      includeIndexFile: true,
      customFilesEndPaths: {
        Form: {
          forceEndPath: "dist/components/form/useDesignSystem.js",
        },
      },
    },
    {
      lib: "@my-state-libs",
      endPath: "dist/app",
      includeIndexFile: true,
      customFilesEndPaths: {
        tenantChannelStore: {
          forceEndPath: "dist/app/tenantChannelStore.js",
        },
        useTenantChannelStore: {
          forceEndPath: "dist/app/tenantChannelStore.js",
        },
      },
    },
    {
      lib: "@my-router-lib",
      endPath: "dist",
      includeIndexFile: true,
    },
    {
      lib: "@my-translation-lib",
      endPath: "dist",
      includeIndexFile: true,
    },
  ] as myExtension.LibsConfiguration[],
  wrongfile: `
            import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
            import { useTranslation } from '@my-translation-lib';
            import { useParams } from '@my-router-lib';
            import ContentBox from '@my-design-system-lib/dist/components/content-box';
            import Divider from '@my-design-system-lib/dist/components/divider';
            import Form from '@my-design-system-lib/dist/components/form';
            import tenantChannelStore from '@my-state-libs/dist/app/tenantChannelStore.js';
            import { showScheduleInputTypes } from '../../utils/scheduledTypes';
            import { useTenantChannel } from '../../hooks';
            import type { customType } from '..types';
            import type { TypographyProps } from '@my-design-system-lib/dist/components/typography';`,
  correctFile: `
            import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
            import { useTranslation } from '@my-translation-lib/dist/index.js';
            import { useParams } from '@my-router-lib/dist/index.js';
            import ContentBox from '@my-design-system-lib/dist/components/content-box/index.js';
            import Divider from '@my-design-system-lib/dist/components/divider/index.js';
            import Form from '@my-design-system-lib/dist/components/form/useDesignSystem.js';
            import tenantChannelStore from '@my-state-libs/dist/app/tenantChannelStore.js';
            import { showScheduleInputTypes } from '../../utils/scheduledTypes';
            import { useTenantChannel } from '../../hooks';
            import type { customType } from '..types';
            import type { TypographyProps } from '@my-design-system-lib/dist/components/typography';`,
};

export const secondSuite = {
  name: "Second Suite",
  libs: [
    {
      lib: "@my-design-system-lib",
      endPath: "dist/components",
      includeIndexFile: true,
      customFilesEndPaths: {
        ContentBox: {
          forceEndPath: "dist/components/content-box/useDesignSystem.js",
        },
      },
    },
    {
      lib: "@my-state-libs",
      endPath: "dist/app",
      includeIndexFile: true,
    },
    {
      lib: "@my-router-lib",
      endPath: "dist",
      includeIndexFile: true,
    },
    {
      lib: "@my-translation-lib",
      endPath: "dist",
      includeIndexFile: true,
    },
  ] as myExtension.LibsConfiguration[],
  wrongfile: `
            import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
            import ContentBox from '@my-design-system-lib/dist/components/content-box';
            import tenantChannelStore from '@my-state-libs/dist/app/tenantChannelStore.js';
            import Divider from '@my-design-system-lib/dist/components/divider';
            import { showScheduleInputTypes } from '../../utils/scheduledTypes';
            import { useTenantChannel } from '../../hooks';
            import { useTranslation } from '@my-translation-lib';
            import { useParams } from '@my-router-lib';
            import type { customType } from '..types';
            import type { TypographyProps } from '@my-design-system-lib/dist/components/typography';`,
  correctFile: `
            import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
            import ContentBox from '@my-design-system-lib/dist/components/content-box/useDesignSystem.js';
            import tenantChannelStore from '@my-state-libs/dist/app/tenantChannelStore.js';
            import Divider from '@my-design-system-lib/dist/components/divider/index.js';
            import { showScheduleInputTypes } from '../../utils/scheduledTypes';
            import { useTenantChannel } from '../../hooks';
            import { useTranslation } from '@my-translation-lib/dist/index.js';
            import { useParams } from '@my-router-lib/dist/index.js';
            import type { customType } from '..types';
            import type { TypographyProps } from '@my-design-system-lib/dist/components/typography';`,
};

export const emptySuite = {
  name: "Empty Suite",
  libs: [] as myExtension.LibsConfiguration[],
  wrongfile: `
            import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
            import ContentBox from '@my-design-system-lib/dist/components/content-box';
            import tenantChannelStore from '@my-state-libs/dist/app/tenantChannelStore.js';
            import Divider from '@my-design-system-lib/dist/components/divider';
            import { showScheduleInputTypes } from '../../utils/scheduledTypes';
            import { useTenantChannel } from '../../hooks';
            import { useTranslation } from '@my-translation-lib';
            import { useParams } from '@my-router-lib';
            import type { customType } from '..types';
            import type { TypographyProps } from '@my-design-system-lib/dist/components/typography';`,
  correctFile: `
            import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
            import ContentBox from '@my-design-system-lib/dist/components/content-box';
            import tenantChannelStore from '@my-state-libs/dist/app/tenantChannelStore.js';
            import Divider from '@my-design-system-lib/dist/components/divider';
            import { showScheduleInputTypes } from '../../utils/scheduledTypes';
            import { useTenantChannel } from '../../hooks';
            import { useTranslation } from '@my-translation-lib';
            import { useParams } from '@my-router-lib';
            import type { customType } from '..types';
            import type { TypographyProps } from '@my-design-system-lib/dist/components/typography';`,
};