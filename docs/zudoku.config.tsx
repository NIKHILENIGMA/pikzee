import type { ZudokuConfig } from "zudoku";
import TechStackCard from "./src/components/TechStackCard";
import ArchitectureDiagram from "./src/components/ArchitectureDiagram";
import TeamOnboardingPage from "./src/components/CustomPages";

const config: ZudokuConfig = {
  // Site configuration
  site: {
    title: "Pikzee's Project Docs",
    logo: {
      src: {
        light: "/logo-light.svg",
        dark: "/logo-dark.svg",
      },
      alt: "Your Project",
      width: "150px",
    },
    showPoweredBy: false,
    footer: {
      copyright: `© ${new Date().getFullYear()} Pikzee. All rights reserved.`,
    }
  },
  // Search configuration
  // search: {
  //   type: "pagefind",
  //   // Optional: Maximum number of sub results per page
  //   maxSubResults: 3,
  //   // Optional: Configure search result ranking (defaults shown below)
  //   ranking: {
  //     termFrequency: 0.8,
  //     pageLength: 0.6,
  //     termSimilarity: 1.2,
  //     termSaturation: 1.2,
  //   },
  // },

  // Theme configuration
  theme: {
    registryUrl: "https://tweakcn.com/r/themes/violet-bloom.json",
  },

  // Navigation structure
  navigation: [
    // Documentation Section
    {
      type: "category",
      label: "Documentation",
      items: [
        // Getting Started
        {
          type: "category",
          label: "Getting Started",
          icon: "rocket",
          items: [
            {
              type: "link",
              icon: "book",
              label: "Introduction",
              to: "/introduction",
            },
            {
              type: "link",
              icon: "book-open",
              label: "Overview",
              to: "/overview",
              badge: {
                label: "Start Here",
                color: "yellow",
              },
            },
            {
              type: "link",
              icon: "download",
              label: "Installation",
              to: "/getting-started/installation",
            },

            {
              type: "link",
              icon: "settings",
              label: "Configuration",
              to: "/getting-started/configuration",
            },
          ],
        },

        // Architecture
        {
          type: "category",
          label: "Architecture",
          icon: "layers",
          collapsible: true,
          items: [
            {
              type: "link",
              icon: "layout",
              label: "System Architecture",
              to: "/architecture",
            },
            {
              type: "link",
              icon: "database",
              label: "Tech Stack",
              to: "/tech-stack",
            },
          ],
        },

        // Frontend
        {
          type: "category",
          label: "Frontend",
          icon: "monitor",
          collapsible: true,
          items: [
            {
              type: "link",
              icon: "eye",
              label: "Overview",
              to: "/frontend",
            },
            {
              type: "link",
              icon: "folder-tree",
              label: "Project Structure",
              to: "/frontend/structure",
            },
            {
              type: "link",
              icon: "boxes",
              label: "Components",
              to: "/frontend/components",
            },
            {
              type: "link",
              icon: "workflow",
              label: "State Management",
              to: "/frontend/state-management",
            },
            {
              type: "link",
              icon: "route",
              label: "Routing",
              to: "/frontend/routing",
            },
            {
              type: "link",
              icon: "palette",
              label: "Styling",
              to: "/frontend/styling",
            },
          ],
        },

        // Backend
        {
          type: "category",
          label: "Backend",
          icon: "server",
          collapsible: true,
          items: [
            {
              type: "link",
              icon: "eye",
              label: "Overview",
              to: "/backend",
            },
            {
              type: "link",
              icon: "folder-tree",
              label: "Project Structure",
              to: "/backend/structure",
            },
            {
              type: "link",
              icon: "database",
              label: "Database",
              to: "/backend/database",
            },
            {
              type: "link",
              icon: "shield",
              label: "Authentication",
              to: "/backend/authentication",
            },
            {
              type: "link",
              icon: "filter",
              label: "Middleware",
              to: "/backend/middleware",
            },
            {
              type: "link",
              icon: "cog",
              label: "Services",
              to: "/backend/services",
            },
          ],
        },

        // Core Features
        {
          type: "category",
          label: "Core Features",
          icon: "star",
          collapsible: true,
          items: [
            {
              type: "link",
              icon: "lightbulb",
              label: "Overview",
              to: "/core-features",
            },
            {
              type: "link",
              icon: "git-branch",
              label: "Feature Workflow",
              to: "/core-features/feature-workflow",
            },
            {
              type: "link",
              icon: "code",
              label: "Development Process",
              to: "/core-features/development-process",
            },
            {
              type: "link",
              icon: "info",
              label: "Testing Strategy",
              to: "/core-features/testing-strategy",
            },
            {
              type: "link",
              icon: "rocket",
              label: "Deployment",
              to: "/core-features/deployment-process",
            },
          ],
        },

        // Guides
        {
          type: "category",
          label: "Guides",
          icon: "book",
          collapsible: true,
          items: [
            {
              type: "link",
              icon: "upload",
              label: "Deployment Guide",
              to: "/guides/deployment",
            },
            {
              type: "link",
              icon: "check-circle",
              label: "Testing Guide",
              to: "/guides/testing",
            },
            {
              type: "link",
              icon: "git-pull-request",
              label: "Contributing",
              to: "/guides/contributing",
            },
            {
              type: "link",
              icon: "bug",
              label: "Debugging",
              to: "/guides/debugging",
            },
          ],
        },
      ],
    },

    // API Reference Section
    {
      type: "link",
      to: "/api",
      label: "API Reference",
      icon: "code-2",
    },

    // Internal Documentation Section
    {
      type: "category",
      label: "Internal Docs",
      items: [
        {
          type: "category",
          icon: "user-cog",
          label: "Features",
          collapsible: false,
          items: [
            {
              type: "category",
              icon: "key",
              label: "Authentication",
              items: [
                {
                  type: "link",
                  icon: "log-in",
                  label: "Login Feature",
                  to: "/internal/features/authentication/login",
                },
                {
                  type: "link",
                  icon: "user-plus",
                  label: "Registration Feature",
                  to: "/internal/features/authentication/registration",
                },
                {
                  type: "link",
                  icon: "unlock",
                  label: "Reset Password Feature",
                  to: "/internal/working/reset-password-feature",
                },
                {
                  type: "link",
                  icon: "log-out",
                  label: "Logout Feature",
                  to: "/internal/working/logout-feature",
                },
              ],
            },
            {
              type: "category",
              icon: "briefcase",
              label: "Workspace Management",
              items: [
                {
                  type: "link",
                  icon: "briefcase",
                  label: "Create Workspace",
                  to: "/internal/working/create-workspace",
                },
                {
                  type: "link",
                  icon: "user-plus",
                  label: "Add Members",
                  to: "/internal/working/add-members",
                },
                {
                  type: "link",
                  icon: "unlock",
                  label: "Remove Members",
                  to: "/internal/working/remove-members",
                },
                {
                  type: "link",
                  icon: "settings",
                  label: "Update Settings",
                  to: "/internal/working/update-workspace-settings",
                },
              ],
            },
            {
              type: "category",
              icon: "presentation",
              label: "Project Management",
              items: [
                {
                  type: "link",
                  icon: "briefcase",
                  label: "Create Project",
                  to: "/internal/working/create-workspace",
                },
                {
                  type: "link",
                  icon: "user-plus",
                  label: "Promote Members",
                  to: "/internal/working/promote-members",
                },
                {
                  type: "link",
                  icon: "unlock",
                  label: "Terminate Project",
                  to: "/internal/working/terminate-project",
                },
                {
                  type: "link",
                  icon: "settings",
                  label: "Remove permission",
                  to: "/internal/working/update-workspace-settings",
                },
              ],
            },
            {
              type: "category",
              icon: "folder",
              label: "Asset Management",
              items: [
                {
                  type: "link",
                  icon: "briefcase",
                  label: "Create Folder",
                  to: "/internal/working/create-folder",
                },
                {
                  type: "link",
                  icon: "user-plus",
                  label: "Upload Assets",
                  to: "/internal/working/upload-assets",
                },
                {
                  type: "link",
                  icon: "unlock",
                  label: "Move Assets",
                  to: "/internal/working/move-assets",
                },
                {
                  type: "link",
                  icon: "settings",
                  label: "Delete Assets",
                  to: "/internal/working/delete-assets",
                },
              ],
            },
            {
              type: "category",
              icon: "folder",
              label: "Document Management",
              items: [
                {
                  type: "link",
                  icon: "briefcase",
                  label: "Create Folder",
                  to: "/internal/working/create-folder",
                },
                {
                  type: "link",
                  icon: "user-plus",
                  label: "Upload Assets",
                  to: "/internal/working/upload-assets",
                },
                {
                  type: "link",
                  icon: "unlock",
                  label: "Move Assets",
                  to: "/internal/working/move-assets",
                },
                {
                  type: "link",
                  icon: "settings",
                  label: "Delete Assets",
                  to: "/internal/working/delete-assets",
                },
              ],
            },
            {
              type: "category",
              icon: "folder",
              label: "Asset Transformation",
              items: [
                {
                  type: "link",
                  icon: "briefcase",
                  label: "Create Folder",
                  to: "/internal/working/create-folder",
                },
                {
                  type: "link",
                  icon: "user-plus",
                  label: "Upload Assets",
                  to: "/internal/working/upload-assets",
                },
                {
                  type: "link",
                  icon: "unlock",
                  label: "Move Assets",
                  to: "/internal/working/move-assets",
                },
                {
                  type: "link",
                  icon: "settings",
                  label: "Delete Assets",
                  to: "/internal/working/delete-assets",
                },
              ],
            },
            {
              type: "category",
              icon: "folder",
              label: "Social Sharing",
              items: [
                {
                  type: "link",
                  icon: "briefcase",
                  label: "Create Folder",
                  to: "/internal/working/create-folder",
                },
                {
                  type: "link",
                  icon: "user-plus",
                  label: "Upload Assets",
                  to: "/internal/working/upload-assets",
                },
                {
                  type: "link",
                  icon: "unlock",
                  label: "Move Assets",
                  to: "/internal/working/move-assets",
                },
                {
                  type: "link",
                  icon: "settings",
                  label: "Delete Assets",
                  to: "/internal/working/delete-assets",
                },
              ],
            },
            {
              type: "category",
              icon: "shield",
              label: "Admin Panel",
              items: [
                {
                  type: "link",
                  icon: "briefcase",
                  label: "Create Folder",
                  to: "/internal/working/create-folder",
                },
                {
                  type: "link",
                  icon: "user-plus",
                  label: "Upload Assets",
                  to: "/internal/working/upload-assets",
                },
                {
                  type: "link",
                  icon: "unlock",
                  label: "Move Assets",
                  to: "/internal/working/move-assets",
                },
                {
                  type: "link",
                  icon: "settings",
                  label: "Delete Assets",
                  to: "/internal/working/delete-assets",
                },
              ],
            },
            
          ]
        },
        {
          type: "custom-page",
          icon: "users",
          label: "Team Onboarding",
          path: "/internal/onboarding",
          badge: {
            label: "For Team",
            color: "blue",
          },
          element: TeamOnboardingPage,
        },
        {
          type: "link",
          icon: "file-code",
          label: "Coding Standards",
          to: "/internal/coding-standards",
        },
        {
          type: "link",
          icon: "git-merge",
          label: "Git Workflow",
          to: "/internal/git-workflow",
        },
        {
          type: "link",
          icon: "eye",
          label: "Code Review",
          to: "/internal/code-review",
        },
        {
          type: "link",
          icon: "alert-triangle",
          label: "Troubleshooting",
          to: "/internal/troubleshooting",
        },
      ],
    },

    // External Links
    {
      type: "category",
      label: "Useful Links",
      collapsible: false,
      items: [
        {
          type: "link",
          icon: "github",
          label: "GitHub Repository",
          to: "https://github.com/NIKHILENIGMA/Pikzee-Client",
        },
        {
          type: "link",
          icon: "message-circle",
          label: "Discord Community",
          to: "https://discord.gg/yourproject",
        },
        {
          type: "link",
          icon: "globe",
          label: "Production Site",
          to: "https://yourproject.com",
        },
      ],
    },
  ],

  // Redirects
  redirects: [
    // { from: "/", to: "/overview" },
    { from: "/docs", to: "/overview" },
  ],

  // API Configuration
  apis: [
    {
      type: "file",
      input: "./apis/openapi.yaml",
      path: "/api",
      options: {
        disablePlayground: false,
      },
    },
  ],

  docs: {
    files: ["/pages/**/*.{md,mdx}"],
    defaultOptions: {
      toc: true,
      disablePager: false,
      showLastModified: true,
      suggestEdit: {
        url: "https://github.com/your-org/your-repo/edit/main/docs",
        text: "Edit this page",
      },
    },
  },

  // Default API settings
  defaults: {
    apis: {
      examplesLanguage: "shell", // Default language for code examples
      disablePlayground: false, // Enable the interactive API playground
      showVersionSelect: "if-available", // Show version selector if multiple versions
      expandAllTags: false, // Keep tags collapsed by default
    },
  },

  // Custom MDX components
  mdx: {
    components: {
      TechStackCard,
      ArchitectureDiagram,
    },
  },
};

export default config;

// import type { ZudokuConfig } from "zudoku";
// import MyCustomComponent from "./src/MyCustomComponent";
// import { MyCustomPage } from "./src/MyCustomPage";

// const config: ZudokuConfig = {
//   site: {
//     logo: {
//       src: { light: "/logo-light.svg", dark: "/logo-dark.svg" },
//       alt: "Zudoku",
//       width: "130px",
//     },
//   },
//   theme: {
//     registryUrl: "https://tweakcn.com/r/themes/violet-bloom.json",
//   },

// navigation: [
//   {
//     type: "category",
//     label: "Documentation",
//     items: [
//       {
//         type: "category",
//         label: "Getting Started",
//         icon: "sparkles",
//         items: [
//           "/introduction",
//           {
//             type: "custom-page",
//             icon: "file",
//             label: "My Custom Page",
//             path: "/a-custom-page",
//             badge: {
//               label: "New",
//               color: "outline",
//             },
//             element: <MyCustomPage />,
//           },
//           {
//             type: "link",
//             icon: "file",
//             label: "Getting Started Guide",
//             to: "/getting-started",
//           },
//         ],
//       },
//       {
//         type: "category",
//         label: "Useful Links",
//         collapsible: false,
//         icon: "link",
//         items: [
//           {
//             type: "link",
//             icon: "book",
//             label: "Zudoku Docs",
//             to: "https://zudoku.dev/docs/",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     type: "link",
//     to: "/api",
//     label: "API Reference",
//   },
// ],
//   redirects: [{ from: "/", to: "/introduction" }],
//   apis: [
//     {
//       type: "file",
//       input: "./apis/openapi.yaml",
//       path: "/api",
//       options: {
//         // examplesLanguage: "bash",
//         disablePlayground: false,
//       },
//     },
//   ],
//   defaults: {
//     apis: {
//       examplesLanguage: "shell", // Default language for code examples
//       disablePlayground: false, // Disable the interactive API playground
//       showVersionSelect: "if-available", // Control version selector visibility
//       expandAllTags: false, // Control initial expanded state of tag categories
//     },
//   },
//   mdx: {
//     components: {
//       MyCustomComponent,
//     },
//   },
// };
// export default config;
