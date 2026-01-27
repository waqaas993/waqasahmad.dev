import importlib.util
import os
import tempfile
import unittest
from importlib.machinery import SourceFileLoader
from pathlib import Path


def load_wrun_module():
    repo_root = Path(__file__).resolve().parents[1]
    wrun_path = repo_root / "wrun"

    loader = SourceFileLoader("wrun_module", str(wrun_path))
    spec = importlib.util.spec_from_loader(loader.name, loader)
    assert spec is not None

    mod = importlib.util.module_from_spec(spec)
    loader.exec_module(mod)
    return mod


class TestSiteGenerators(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.wrun = load_wrun_module()

    def _in_tmpdir(self):
        return tempfile.TemporaryDirectory(prefix="wrun-site-tests-")

    def _chdir(self, path: Path):
        class _Cwd:
            def __init__(self, new_dir: Path):
                self.new_dir = new_dir
                self.old_dir = None

            def __enter__(self):
                self.old_dir = Path.cwd()
                os.chdir(self.new_dir)
                return self

            def __exit__(self, exc_type, exc, tb):
                os.chdir(self.old_dir)

        return _Cwd(path)

    def test_validate_slug(self):
        ok = ["pack-match-3d", "wear-os-port", "a1", "a1-b2"]
        bad = ["Pack Match 3D", "pack_match_3d", "-pack", "pack-", "pack--match", "p", "a" * 61]

        for s in ok:
            self.wrun.validate_slug(s)

        for s in bad:
            with self.assertRaises(ValueError):
                self.wrun.validate_slug(s)

    def test_validate_base_url(self):
        self.wrun.validate_base_url("https://example.com")

        with self.assertRaises(ValueError):
            self.wrun.validate_base_url("http://example.com")

        with self.assertRaises(ValueError):
            self.wrun.validate_base_url("https://example.com/")

    def test_site_init_collision_is_transactional(self):
        with self._in_tmpdir() as d:
            tmp = Path(d)
            (tmp / "index.html").write_text("existing", encoding="utf-8")

            with self._chdir(tmp):
                rc = self.wrun.cmd_site_init(["--defaults"])

            self.assertNotEqual(rc, 0)
            self.assertFalse((tmp / "warp.config.json").exists())
            self.assertFalse((tmp / "assets").exists())
            self.assertFalse((tmp / "work").exists())

    def test_site_init_defaults_creates_expected_files(self):
        with self._in_tmpdir() as d:
            tmp = Path(d)
            with self._chdir(tmp):
                rc = self.wrun.cmd_site_init(["--defaults"])

            self.assertEqual(rc, 0)
            self.assertTrue((tmp / "warp.config.json").exists())
            self.assertTrue((tmp / "index.html").exists())
            self.assertTrue((tmp / "work" / "index.html").exists())
            self.assertTrue((tmp / "assets" / "data" / "work.json").exists())
            self.assertTrue((tmp / "assets" / "js" / "work.js").exists())
            self.assertTrue((tmp / "assets" / "css" / "site.css").exists())
            self.assertTrue((tmp / "assets" / "images" / "og.png").exists())
            self.assertTrue((tmp / "assets" / "images" / "favicon.png").exists())
            self.assertTrue((tmp / "robots.txt").exists())
            self.assertTrue((tmp / "sitemap.xml").exists())

    def test_site_project_duplicate_slug_rejected(self):
        with self._in_tmpdir() as d:
            tmp = Path(d)
            with self._chdir(tmp):
                self.assertEqual(self.wrun.cmd_site_init(["--defaults"]), 0)
                self.assertEqual(self.wrun.cmd_site_project(["pack-match-3d", "--defaults"]), 0)

                work_json = tmp / "assets" / "data" / "work.json"
                data1 = self.wrun.read_json_file(work_json)
                self.assertEqual(len(data1), 1)

                rc = self.wrun.cmd_site_project(["pack-match-3d", "--defaults"])
                self.assertNotEqual(rc, 0)

                data2 = self.wrun.read_json_file(work_json)
                self.assertEqual(len(data2), 1)

    def test_site_work_force_does_not_overwrite_html(self):
        with self._in_tmpdir() as d:
            tmp = Path(d)
            with self._chdir(tmp):
                self.assertEqual(self.wrun.cmd_site_init(["--defaults"]), 0)

                work_html = tmp / "work" / "index.html"
                work_html.write_text("CUSTOM", encoding="utf-8")

                work_js = tmp / "assets" / "js" / "work.js"
                work_js.write_text("BROKEN", encoding="utf-8")

                self.assertEqual(self.wrun.cmd_site_work(["--force"]), 0)

                self.assertEqual(work_html.read_text(encoding="utf-8"), "CUSTOM")
                self.assertEqual(work_js.read_text(encoding="utf-8"), self.wrun._default_work_js())


if __name__ == "__main__":
    unittest.main()
