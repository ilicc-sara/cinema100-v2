declare module "@splidejs/react-splide" {
  import { ComponentType } from "react";

  type SplideProps = {
    options?: Record<string, any>;
    children?: React.ReactNode;
    className?: string;
  };

  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<{ children?: React.ReactNode }>;
}
