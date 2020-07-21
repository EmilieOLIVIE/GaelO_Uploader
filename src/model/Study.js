/**
 Copyright (C) 2018-2020 KANOUN Salim
 This program is free software; you can redistribute it and/or modify
 it under the terms of the Affero GNU General Public v.3 License as published by
 the Free Software Foundation;
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 Affero GNU General Public Public for more details.
 You should have received a copy of the Affero GNU General Public Public along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

import SHA1 from 'crypto-js/sha1'
import { NOT_EXPECTED_VISIT, NULL_VISIT_ID } from './Warning'

export default class Study {

    series = {}

    constructor(studyInstanceUID, studyID, studyDate, studyDescription, accessionNumber, patientID, patientFirstName, patientLastName,
        patientBirthDate, patientSex, acquisitionDate) {
        this.studyInstanceUID = studyInstanceUID
        this.studyID = studyID
        this.studyDate = studyDate
        this.studyDescription = studyDescription
        this.accessionNumber = accessionNumber
        this.patientID = patientID
        this.patientFirstName = patientFirstName
        this.patientLastName = patientLastName
        this.patientBirthDate = this.getDate(patientBirthDate)
        this.patientSex = patientSex
        this.acquisitionDate = this.getDate(acquisitionDate)
        this.patientName = patientFirstName + ' ' + patientLastName
        this.warnings = {}
        this.visit = null
    }

    addSeries(seriesObject) {
        if (!this.isExistingSeries(seriesObject.seriesInstanceUID)) {
            this.series[seriesObject.seriesInstanceUID] = seriesObject
            return seriesObject
        } else throw new Error('Existing Series')
    }

    isExistingSeries(seriesInstanceUID) {
        let existingSeriesInstanceUID = Object.keys(this.series)
        return existingSeriesInstanceUID.includes(seriesInstanceUID)
    }

    getSeries(seriesInstanceUID) {
        return this.series[seriesInstanceUID]
    }

    getSeriesArray() {
        let series = Object.values(this.series)
        return series
    }

    getChildSeriesInstanceUIDs() {
        return Object.keys(this.series)
    }

    getPatientName() {
        return (this.patientFirstName + this.patientLastName)
    }

    getPatientFirstName() {
        return this.patientFirstName
    }

    getPatientLastName() {
        return this.patientLastName
    }

    getStudyInstanceUID() {
        return this.studyInstanceUID
    }

    getStudyID() {
        return this.studyID
    }

    getStudyDate() {
        return this.studyDate
    }

    getAcquisitionDate() {
        return this.acquisitionDate
    }

    getDate(rawDate) {
        if (rawDate != null) {
            return (rawDate.substring(0, 4) + '-' + rawDate.substring(4, 6) + '-' + rawDate.substring(6, 8))
        } else {
            return null
        }
    }

    getStudyDescription() {
        return this.studyDescription
    }

    getPatientBirthDate() {
        return this.patientBirthDate
    }

    getPatientSex() {
        return this.patientSex
    }

    getPatientID() {
        return this.patientID
    }

    setStatusStudy(key, dismissed) {
        this.warnings[key]['dismissed'] = dismissed
    }

    //SK Pour envoyer au back pour savoir si etude connue ou pas et au moment du post processing
    getOrthancStudyID() {
        let hash = SHA1(this.patientID + '|' + this.studyInstanceUID).toString()
        return `${hash.substring(0, 8)}-${hash.substring(8, 16)}-${hash.substring(16, 24)}-${hash.substring(24, 32)}-${hash.substring(32, 40)}`
    }

    getWarnings() {
        return this.warnings
    }

    checkStudies() {
        // Check if the study corresponds to the visits in wait for series upload
        let expectedVisit = this.findExpectedVisit(this);
        if (expectedVisit === undefined) {
            this.warnings[NOT_EXPECTED_VISIT.key] = NOT_EXPECTED_VISIT;
        }

        // Check if visit ID is set
        if (this.visit == null || typeof this.visit.idVisit === undefined) {
            this.warnings[NULL_VISIT_ID.key] = NULL_VISIT_ID;
        }
    }

    findExpectedVisit(st) {
        let thisP = st.getPatientName();

        if (thisP.givenName === undefined) {
            return undefined;
        }
        if (thisP.familyName === undefined) {
            return undefined;
        }

        thisP.birthDate = st.getPatientBirthDate();
        thisP.sex = st.patientSex;

        if (thisP.birthDate === undefined || thisP.sex === undefined) {
            return undefined;
        }
    }
}