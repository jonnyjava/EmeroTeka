import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card.tsx';

describe('UI Card Components', () => {
  it('renders complete Card hierarchy with all subcomponents and refs', () => {
    const cardRef = React.createRef<HTMLDivElement>();
    const headerRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLHeadingElement>();
    const descRef = React.createRef<HTMLParagraphElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    const footerRef = React.createRef<HTMLDivElement>();

    render(
      <Card ref={cardRef} className="custom-card">
        <CardHeader ref={headerRef} className="custom-header">
          <CardTitle ref={titleRef} className="custom-title">Card Headline</CardTitle>
          <CardDescription ref={descRef} className="custom-desc">Card subtitle text</CardDescription>
        </CardHeader>
        <CardContent ref={contentRef} className="custom-content">
          <p>Main content area</p>
        </CardContent>
        <CardFooter ref={footerRef} className="custom-footer">
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Headline')).toBeInTheDocument();
    expect(screen.getByText('Card subtitle text')).toBeInTheDocument();
    expect(screen.getByText('Main content area')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();

    expect(cardRef.current).toBeInstanceOf(HTMLDivElement);
    expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
    expect(descRef.current).toBeInstanceOf(HTMLParagraphElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(footerRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
