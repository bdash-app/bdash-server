-- AlterTable
ALTER TABLE `BdashQuery` MODIFY `description` TEXT NOT NULL,
    MODIFY `query_sql` TEXT NOT NULL,
    MODIFY `result_tsv` TEXT NOT NULL,
    MODIFY `metadata_md` VARCHAR(512) NOT NULL,
    MODIFY `chart_svg` MEDIUMTEXT;
