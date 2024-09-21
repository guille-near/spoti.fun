"use client"

import * as React from "react"

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

type ToasterState = {
  toasts: ToasterToast[]
}

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: ToasterToast }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

const toastReducer = (state: ToasterState, action: Action): ToasterState => {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts] }
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined
            ? { ...t, dismissed: true }
            : t
        ),
      }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return { ...state, toasts: [] }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

export function useToast() {
  const [state, dispatch] = React.useReducer(toastReducer, {
    toasts: [],
  })

  const toast = React.useCallback(
    (props: Omit<ToasterToast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9)
      dispatch({
        type: "ADD_TOAST",
        toast: { ...props, id },
      })
      return id
    },
    [dispatch]
  )

  const update = React.useCallback(
    (id: string, props: Partial<ToasterToast>) => {
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      })
    },
    [dispatch]
  )

  const dismiss = React.useCallback(
    (id: string) => {
      dispatch({
        type: "DISMISS_TOAST",
        toastId: id,
      })
    },
    [dispatch]
  )

  const remove = React.useCallback(
    (id: string) => {
      dispatch({
        type: "REMOVE_TOAST",
        toastId: id,
      })
    },
    [dispatch]
  )

  return {
    toasts: state.toasts,
    toast,
    update,
    dismiss,
    remove,
  }
}
