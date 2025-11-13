import React from "react";

interface DiagramProps {
  title: string;
  imageSrc: string;
  description?: string;
}

const ArchitectureDiagram: React.FC<DiagramProps> = ({
  title,
  imageSrc,
  description,
}) => {
  return (
    <div className="architecture-diagram">
      <img src={imageSrc} alt={title} />
      <h3>
        {title}
        {description && <p>{description}</p>}
      </h3>
    </div>
  );
};

export default ArchitectureDiagram;
