import { execSync } from "child_process";
import type { Configuration as WebpackConfig } from "webpack";
import type { NextConfig } from "next";
import { createHash } from "crypto";
import WebpackObfuscator from 'webpack-obfuscator';

const EPOCH = BigInt("1420070400000");

const HOUR_MS = 60 * 60 * 1000;
const hourStart = Math.floor(Date.now() / HOUR_MS) * HOUR_MS;

const seed = createHash("sha256").update(String(hourStart)).digest();
const seq12 = BigInt(seed.readUInt16BE(0) & 0x0fff);

const snowflakeId = (((BigInt(hourStart) - EPOCH) << BigInt(22)) | seq12).toString();

function bigintToBase64Url(n: bigint | string): string {
  const bn = typeof n === "bigint" ? n : BigInt(n);
  if (bn === BigInt(0)) return "A";
  let hex = bn.toString(16);
  if (hex.length % 2) hex = "0" + hex;
  const buf = Buffer.from(hex, "hex");
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const snowflakeIdBase64 = bigintToBase64Url(snowflakeId);

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  assetPrefix: isProd ? `/_v/t00001/${snowflakeIdBase64}` : undefined,
  distDir: ".next",
  poweredByHeader: false,
  generateBuildId: async () => snowflakeId,
  compiler: {
    removeConsole: true,
  },
  env: {
    build: snowflakeId,
    buildbase64: snowflakeIdBase64,
    commit: execSync("git rev-parse HEAD").toString().trim(),
  },
  experimental: {
    // cacheComponents: true,
    cssChunking: "strict",
    optimizePackageImports: [
      'react',
      'react-dom',
      'next',
      'styled-components',
      '@tanstack/react-query',
      'framer-motion',
      'zustand',
      '@chakra-ui/react'
    ],
  },
  webpack(config: WebpackConfig, { buildId, dev, isServer }) {
    if (config.output) {
      config.output.publicPath = isProd
        ? `/_v/t00001/${snowflakeIdBase64}/_next/`
        : "/_next/";
    }

    const generateObfuscatedClassName = (localName: string, resourcePath: string) => {
      const hash = createHash('sha256').update(localName + resourcePath).digest('base64url').slice(0, 8);
      return "v_" + hash;
    };

    if (!dev && !isServer) {
      if (!config.optimization) (config as any).optimization = {};

      if (config.optimization) {
        config.optimization.chunkIds = 'deterministic';
        config.optimization.moduleIds = 'deterministic';
        config.optimization.splitChunks = {
          chunks: "initial",
          minSize: 300000,
          maxInitialRequests: 1,
          maxAsyncRequests: 1,
          cacheGroups: {
            default: false,
            vendors: false,
            colorful: {
              filename: `static/${buildId}/ext/colors.[contenthash].js`,
              test: /colors\.json$/,
              name: "colorful",
              enforce: true,
              chunks: "all"
            },
            client: {
              filename: `static/${buildId}/a/c.[contenthash].js`,
              test: /src\/lib\/actions\/client\.ts$/,
              name: "client",
              enforce: true,
              chunks: "all",
              minSize: 0
            },
            clientQuery: {
              filename: `static/${buildId}/a/cq.[contenthash].js`,
              test: /src\/lib\/actions\/clientQuery\.ts$/,
              name: "clientQuery",
              enforce: true,
              chunks: "all",
              minSize: 0
            },
            types: {
              filename: `static/${buildId}/a/t.[contenthash].js`,
              test: /src\/lib\/actions\/types\.ts$/,
              name: "types",
              enforce: true,
              chunks: "all",
              minSize: 0
            },
            pow: {
              filename: `static/${buildId}/a/p.[contenthash].js`,
              test: /src\/lib\/pow\//,
              name: "pow",
              enforce: true,
              chunks: "all",
              minSize: 0
            }
          }
        };
        config.optimization.runtimeChunk = false;
      }
      config.output = {
        ...config.output,
        hashFunction: "xxhash64",
        hashDigest: 'base64url',
        hashDigestLength: 16,
        filename: `static/${buildId}/[contenthash].js`,
        chunkFilename: `static/${buildId}/[contenthash].js`,
        // assetModuleFilename: `static/media/${buildId}/[contenthash][ext]`,
      };


      if (config.module && config.module.rules) {
        config.module.rules.push({
          test: /\.json$/,
          type: "javascript/auto",
          use: [
            {
              loader: "json-loader",
            },
          ],
        });
      }

      if (!config.plugins) config.plugins = [];
      config.plugins.push(
        new WebpackObfuscator(
          {
            optionsPreset: 'low-obfuscation',
            target: 'browser',
            compact: true,
            simplify: true,
            identifierNamesGenerator: 'mangled',
            unicodeEscapeSequence: true,
            renameGlobals: false,
            stringArray: true,
            stringArrayThreshold: 0.25,
            stringArrayEncoding: ['base64'],
            stringArrayWrappersCount: 1,
            rotateStringArray: true,
            selfDefending: false,
            controlFlowFlattening: false,
            numbersToExpressions: false,
            deadCodeInjection: false
          }
        )
      )

    }

    if (config.module && config.module.rules) {
      config.module.rules.forEach((rule) => {
        if (rule && typeof rule === 'object' && "oneOf" in rule && Array.isArray(rule.oneOf)) {
          rule.oneOf.forEach((one: any) => {
            if (Array.isArray((one as any).use)) {
              (one as any).use.forEach((u: any) => {
                if (u.loader?.includes("css-loader") && u.options?.modules) {
                  if (dev) {
                    u.options.modules.localIdentName = "[name]__[local]__[hash:base64:5]";
                  } else {
                    u.options.modules.getLocalIdent = (context: any, _: string, localName: string) => generateObfuscatedClassName(localName, context.resourcePath);
                  }
                }
              });
            }
          });
        } else if (rule && typeof rule === 'object' && rule.use && Array.isArray(rule.use)) {
          rule.use.forEach((u: any) => {
            if (u.loader?.includes("css-loader") && u.options?.modules) {
              if (dev) {
                u.options.modules.localIdentName = "[name]__[local]__[hash:base64:5]";
              } else {
                u.options.modules.getLocalIdent = (context: any, _: string, localName: string) => generateObfuscatedClassName(localName, context.resourcePath);
              }
            }
          });
        }
      });
    }
    config.resolve = {
      ...(config.resolve || {}),
      alias: {
        ...((config.resolve && (config.resolve as any).alias) || {}),
        'fs': false,
        'path': false,
        'os': false,
      },
    };

    return config;
  },
  turbopack: {
    resolveExtensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json',
      '.css',
      '.scss',
      '.sass',
      '.less',
      '.styl',
      '.woff',
      '.woff2',
      '.svg',
      '.webp',
      '.avif',
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.ico',
      '.glsl',
      '.vert',
      '.frag',
      '.md',
      '.mdx'
    ],
    resolveAlias: {
      '@': './src',
      '@/components': './src/components',
      '@/lib': './src/lib',
      '@/types': './src/types',
      '@/hooks': './src/hooks',
      '@/assets': './src/assets',
      '@/app': './src/app',
      '@/providers': './src/providers',
      '@/styles': './src/styles',
      '@/utils': './src/lib',

      'react/jsx-runtime': 'react/jsx-runtime',
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime',

      'lodash': 'lodash-es',
      'moment': 'dayjs',

      'react-icons/fa': 'react-icons/fa/index.esm.js',
      'react-icons/md': 'react-icons/md/index.esm.js',
      'react-icons/io': 'react-icons/io/index.esm.js',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vain.bot",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/embed/avatars/**",
      },
    ],
    // formats: ['image/webp'],
    qualities: [100, 80, 60, 40, 20, 90, 95],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  compress: true,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },

  headers: async () => [
    {
      source: '/sw.js',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
        {
          key: 'Content-Type',
          value: 'application/javascript',
        },
        {
          key: 'Service-Worker-Allowed',
          value: '/',
        },
      ],
    },
    {
      source: '/(.*)',
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https: https://cdn.discordapp.com https://media.discordapp.net https://discord.com https://*.vain.bot",
            "font-src 'self' data: https:",
            "media-src 'self' blob: https: https://cdn.discordapp.com https://media.discordapp.net https://*.vain.bot",
            "connect-src 'self' https: wss: https://discord.com https://discordapp.com https://cdn.discordapp.com https://*.vain.bot",
            "frame-src 'self' https://challenges.cloudflare.com",
            "frame-ancestors 'none'",
            "form-action 'self' https://discord.com https://discordapp.com",
            "base-uri 'self'",
            "object-src 'none'",
            "manifest-src 'self'",
            "worker-src 'self' blob:",
            "child-src 'self' blob:",
            "prefetch-src 'self' https:"].join("; "),
        },
        {
          key: "Cross-Origin-Resource-Policy",
          value: "same-origin",
        },
        {
          key: "Cross-Origin-Opener-Policy",
          value: "same-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()"
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ],
  async rewrites() {
    return [
      {
        source: "/_v/t00001/:buildId/_next/:path*",
        destination: "/_next/:path*",
      },
      {
        source: "/_v/t00001/:buildId/_next/image",
        destination: "/_next/image",
      },
      {
        source: "/_v/t00001/:buildId/_next/static/media/:file*",
        destination: "/_next/static/media/:file*",
      },
    ];
  }
};

export default nextConfig;
