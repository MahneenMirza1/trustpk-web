"use client";

import { useCallback, useEffect, useState } from "react";
import { getFiltersMeta, getUniversities } from "@/services/universityApi";
import type { UniversityCard, UniversityFilterState } from "@/types/university";

export function useUniversities() {
  const [universities, setUniversities] = useState<UniversityCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("");
  const [degree, setDegree] = useState("");
  const [status, setStatus] = useState("");

  const [metaOptions, setMetaOptions] = useState<{
    provinces: string[];
    cities: string[];
    sectors: string[];
    degrees: string[];
    statuses: string[];
  }>({
    provinces: [],
    cities: [],
    sectors: [],
    degrees: [],
    statuses: [],
  });

  // Load filter options on mount
  useEffect(() => {
    getFiltersMeta()
      .then((data) => setMetaOptions(data))
      .catch((err) => console.error("Failed to load filter metadata:", err));
  }, []);

  const fetchUniversities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUniversities({
        search,
        province,
        city,
        sector,
        degree,
        status,
      });
      setUniversities(data);
    } catch (err) {
      console.error("University API error:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load universities."
      );
    } finally {
      setLoading(false);
    }
  }, [search, province, city, sector, degree, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUniversities();
    }, 250); // slight debounce for search input

    return () => clearTimeout(timer);
  }, [fetchUniversities]);

  function clearFilters() {
    setSearch("");
    setProvince("");
    setCity("");
    setSector("");
    setDegree("");
    setStatus("");
  }

  return {
    universities,
    loading,
    error,
    search,
    province,
    city,
    sector,
    degree,
    status,
    metaOptions,
    setSearch,
    setProvince,
    setCity,
    setSector,
    setDegree,
    setStatus,
    clearFilters,
    refetch: fetchUniversities,
  };
}
