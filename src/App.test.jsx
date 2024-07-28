import { vi, describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe('something truthy and falsy', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  });

  it('false to be false', () => {
    expect(false).toBe(false);
  });
});

//I'm going to need to make some tests where I can set what's in the grid, and try out moves at certain breakpoints.