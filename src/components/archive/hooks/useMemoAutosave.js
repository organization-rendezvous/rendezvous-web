import { useRef, useState } from "react";
import { api } from "../../../api/index";

export function useMemoAutosave(archiveId, initialMemo = "") {
  const [memo, setMemo] = useState(initialMemo);
  const [memoSaving, setMemoSaving] = useState(false);

  const timerRef = useRef(null);

  const handleMemoChange = (value) => {
    setMemo(value);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setMemoSaving(true);

      await api.archive.archiveMemo(archiveId, value).catch(() => {});

      setMemoSaving(false);
    }, 1000);
  };

  return {
    memo,
    setMemo,
    memoSaving,
    handleMemoChange,
  };
}
