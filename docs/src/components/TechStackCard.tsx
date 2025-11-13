import React from "react";

interface Technology {
  name: string;
  description: string;
  icon?: string;
  version?: string;
  link?: string;
}

interface TechStackCardProps {
  category: string;
  technologies: Technology[];
}

const TechStackCard: React.FC<TechStackCardProps> = ({
  technologies,
}) => {
  return (
    <div className="tech-stack-card border-slate-500 border-b mb-2">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Documentation
      </h3>
      <ul className="space-y-3 list-none p-0 m-0">
        {technologies.map((tech) => (
          <li key={tech.name}>
            <a
              href={tech.link || "#"}
              target={tech.link ? "_blank" : "_self"}
              rel={tech.link ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full no-underline"
            >
              {tech.icon && (
              <img
                src={tech.icon}
                alt={`${tech.name} icon`}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-secondary/80 dark:bg-gray-700 p-1"
              />
              )}
              <div className="min-w-0 pt-2.5">
              <div className="flex items-center gap-2">
                <strong className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {tech.name}
                </strong>
                {tech.version && (
                <span className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {tech.version}
                </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {tech.description}
              </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechStackCard;

