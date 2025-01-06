import { act, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import cloneDeep from "clone-deep";
import reactHotToast, { Toaster } from "react-hot-toast";
import { vi } from "vitest";

import ToastCard from "./ToastCard";
import type { Props } from "./types";

describe("Toast Card", () => {
  const toastInstanceExample: Props["toastInstance"] = {
    createdAt: 1623162274616,
    dismissed: false,
    duration: 5000,
    id: "2",
    message: "message",
    pauseDuration: 0,
    style: {},
    type: "custom",
    visible: true,
  };

  afterEach(() => {
    act(() => reactHotToast.remove());
  });

  test("should display message", () => {
    const t = cloneDeep(toastInstanceExample);
    render(
      <ToastCard type="positive" toastInstance={t}>
        I am a toast message
      </ToastCard>,
    );
    expect(screen.getByText("I am a toast message")).toHaveClass(
      "toast-card__message",
    );
  });

  test("should display as correct type", () => {
    const t = cloneDeep(toastInstanceExample);
    const { container } = render(
      <ToastCard type="positive" toastInstance={t}>
        I am a toast message
      </ToastCard>,
    );
    expect(container.firstChild).toHaveAttribute("data-type", "positive");
  });

  test("should display correct success icon", () => {
    const t = cloneDeep(toastInstanceExample);
    render(
      <ToastCard type="positive" toastInstance={t}>
        I am a toast message
      </ToastCard>,
    );
    expect(document.querySelector(".p-icon--success")).toBeInTheDocument();
  });

  test("should display correct error icon", () => {
    const t = cloneDeep(toastInstanceExample);
    render(
      <ToastCard type="negative" toastInstance={t}>
        I am a toast message
      </ToastCard>,
    );
    expect(document.querySelector(".p-icon--error")).toBeInTheDocument();
  });

  test("should display correct warning icon", () => {
    const t = cloneDeep(toastInstanceExample);
    render(
      <ToastCard type="caution" toastInstance={t}>
        I am a toast message
      </ToastCard>,
    );
    expect(document.querySelector(".p-icon--warning")).toBeInTheDocument();
  });

  test("should display close icon", () => {
    const t = cloneDeep(toastInstanceExample);
    render(
      <ToastCard type="negative" toastInstance={t}>
        I am a toast message
      </ToastCard>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass(
      "p-icon--close",
    );
  });

  test("should not display an undo button if an undo function is not passed", () => {
    const t = cloneDeep(toastInstanceExample);
    render(
      <ToastCard type="negative" toastInstance={t}>
        I am a toast message
      </ToastCard>,
    );
    expect(
      screen.queryByRole("button", { name: "Undo" }),
    ).not.toBeInTheDocument();
  });

  test("should display a clickable undo button if an undo function is passed", async () => {
    const undoFn = vi.fn();
    const t = cloneDeep(toastInstanceExample);
    render(
      <ToastCard type="negative" toastInstance={t} undo={undoFn}>
        I am a toast message
      </ToastCard>,
    );
    const undoButton = screen.getByRole("button", { name: "Undo" });
    expect(undoButton).toBeInTheDocument();
    await userEvent.click(undoButton);
    expect(undoFn).toHaveBeenCalled();
  });

  test("should remove the card when close is clicked", async () => {
    render(<Toaster />);
    await act(async () => {
      reactHotToast.custom((t) => (
        <ToastCard type="negative" toastInstance={t}>
          I am a toast message
        </ToastCard>
      ));
    });
    expect(await screen.findByRole("status")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close" }), {
      pointerEventsCheck: 0,
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  test("should close the card using the keyboard", async () => {
    render(<Toaster />);
    await act(async () => {
      reactHotToast.custom((t) => (
        <ToastCard type="negative" toastInstance={t}>
          I am a toast message
        </ToastCard>
      ));
    });
    expect(await screen.findByRole("status")).toBeInTheDocument();
    fireEvent.keyUp(screen.getByRole("button", { name: "Close" }), {
      key: " ",
      code: "Space",
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
