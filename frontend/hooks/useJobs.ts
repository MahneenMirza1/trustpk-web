"use client";

import { useCallback, useEffect, useState } from "react";
import { getJobFilters, getJobs, getOfficialSources } from "@/services/jobsApi";
import type {
  GovernmentJobListItem,
  JobFiltersResponse,
  OfficialSourceSummary,
} from "@/types/job";

export function useJobs(initialProvince: string = "All Pakistan", initialCategory: string = "") {
  const [jobs, setJobs] = useState<GovernmentJobListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [province, setProvince] = useState<string>(initialProvince);
  const [category, setCategory] = useState<string>(initialCategory);
  const [keyword, setKeyword] = useState<string>("");
  const [bps, setBps] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [showExpired, setShowExpired] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filter options and sources meta
  const [filterOptions, setFilterOptions] = useState<JobFiltersResponse | null>(null);
  const [sources, setSources] = useState<OfficialSourceSummary[]>([]);
  const [sourcesLoading, setSourcesLoading] = useState<boolean>(false);

  // Load filter options and sources on mount
  useEffect(() => {
    let mounted = true;
    async function loadMeta() {
      try {
        setSourcesLoading(true);
        const [filtersRes, sourcesRes] = await Promise.all([
          getJobFilters(),
          getOfficialSources(),
        ]);
        if (mounted) {
          setFilterOptions(filtersRes);
          setSources(sourcesRes);
        }
      } catch (err) {
        console.warn("Could not fetch filter options:", err);
      } finally {
        if (mounted) setSourcesLoading(false);
      }
    }
    loadMeta();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch jobs when filters change
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getJobs({
        province: province || undefined,
        category: category || undefined,
        keyword: keyword || undefined,
        bps: bps || undefined,
        status: status || undefined,
        source: source || undefined,
        show_expired: showExpired,
        page,
        page_size: 15,
      });
      setJobs(res.items);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch (err: any) {
      console.error("Error loading government jobs:", err);
      setError("Unable to connect to verified government job services. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [province, category, keyword, bps, status, source, showExpired, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const clearFilters = useCallback(() => {
    setProvince("All Pakistan");
    setCategory("");
    setKeyword("");
    setBps("");
    setStatus("");
    setSource("");
    setShowExpired(false);
    setPage(1);
  }, []);

  const handleSearchSubmit = useCallback((newKeyword: string, newProvince?: string, newCategory?: string) => {
    setKeyword(newKeyword);
    if (newProvince !== undefined) setProvince(newProvince);
    if (newCategory !== undefined) setCategory(newCategory);
    setPage(1);
  }, []);

  return {
    jobs,
    loading,
    error,
    province,
    category,
    keyword,
    bps,
    status,
    source,
    showExpired,
    page,
    total,
    totalPages,
    filterOptions,
    sources,
    sourcesLoading,
    setProvince: (p: string) => {
      setProvince(p);
      setPage(1);
    },
    setCategory: (c: string) => {
      setCategory(c);
      setPage(1);
    },
    setKeyword,
    setBps: (b: string) => {
      setBps(b);
      setPage(1);
    },
    setStatus: (s: string) => {
      setStatus(s);
      setPage(1);
    },
    setSource: (src: string) => {
      setSource(src);
      setPage(1);
    },
    setShowExpired: (exp: boolean) => {
      setShowExpired(exp);
      setPage(1);
    },
    setPage,
    clearFilters,
    handleSearchSubmit,
    refetch: fetchJobs,
  };
}
